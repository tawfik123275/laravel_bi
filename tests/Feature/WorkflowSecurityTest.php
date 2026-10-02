<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class WorkflowSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        Schema::create('patients_lab', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone');
            $table->string('email')->nullable();
        });

        Schema::create('laboratory_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('laboratory_id')->nullable();
            $table->unsignedBigInteger('patient_id');
            $table->string('barcode')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('status');
            $table->text('results')->nullable();
            $table->timestamps();
        });
    }

    public function test_doctor_routes_require_a_doctor_role(): void
    {
        $this->get('/doctor')->assertRedirect('/login');

        $this->actingAs(User::factory()->create(['role' => 'lab']))
            ->get('/doctor')
            ->assertForbidden();

        $this->actingAs(User::factory()->create(['role' => 'doctor']))
            ->get('/doctor')
            ->assertOk();
    }

    public function test_doctor_can_only_read_own_payment_history(): void
    {
        $owner = User::factory()->create(['role' => 'doctor']);
        $otherDoctor = User::factory()->create(['role' => 'doctor']);
        $invoiceId = $this->createInvoice($owner->id);

        $this->actingAs($owner)
            ->getJson("/billing/invoices/{$invoiceId}/payments")
            ->assertOk()
            ->assertJsonPath('data', []);

        $this->actingAs($otherDoctor)
            ->getJson("/billing/invoices/{$invoiceId}/payments")
            ->assertNotFound();
    }

    public function test_payment_cannot_exceed_the_invoice_balance(): void
    {
        $doctor = User::factory()->create(['role' => 'doctor']);
        $invoiceId = $this->createInvoice($doctor->id, 100, 75);

        $this->actingAs($doctor)->postJson("/billing/invoices/{$invoiceId}/payments", [
            'amount' => '25.01',
            'method' => 'cash',
            'idempotency_key' => 'e758fa4f-7b41-4c2d-9875-33ee66919783',
        ])->assertUnprocessable();

        $this->assertDatabaseCount('billing_payments', 0);
        $this->assertDatabaseHas('billing_invoices', [
            'id' => $invoiceId,
            'amount_paid' => '75.00',
            'status' => 'partial',
        ]);
    }

    public function test_retried_payment_with_same_key_is_recorded_once(): void
    {
        $doctor = User::factory()->create(['role' => 'doctor']);
        $invoiceId = $this->createInvoice($doctor->id);
        $payment = [
            'amount' => '25.00',
            'method' => 'cash',
            'idempotency_key' => '7c6c0de1-ef95-4c74-939d-8c66a4ee319d',
        ];

        $this->actingAs($doctor)
            ->postJson("/billing/invoices/{$invoiceId}/payments", $payment)
            ->assertOk()
            ->assertJsonPath('duplicate', false);

        $this->postJson("/billing/invoices/{$invoiceId}/payments", $payment)
            ->assertOk()
            ->assertJsonPath('duplicate', true);

        $this->assertDatabaseCount('billing_payments', 1);
        $this->assertDatabaseHas('billing_invoices', [
            'id' => $invoiceId,
            'amount_paid' => '25.00',
            'status' => 'partial',
        ]);
    }

    public function test_laboratory_must_claim_a_request_before_completing_results(): void
    {
        $laboratory = User::factory()->create(['role' => 'lab']);
        $patientId = DB::table('patients_lab')->insertGetId([
            'full_name' => 'Test patient',
            'phone' => '5550000',
        ]);
        $requestId = DB::table('laboratory_requests')->insertGetId([
            'patient_id' => $patientId,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->actingAs($laboratory)
            ->postJson("/analysis-requests/{$requestId}/claim")
            ->assertOk();

        $this->postJson("/analysis-requests-details/{$requestId}/update-results", [
            'status' => 'completed',
            'results' => ['CBC' => ''],
        ])->assertUnprocessable();

        $this->postJson("/analysis-requests-details/{$requestId}/update-results", [
            'status' => 'completed',
            'results' => ['CBC' => 'Normal'],
        ])->assertOk();

        $this->assertDatabaseHas('laboratory_requests', [
            'id' => $requestId,
            'laboratory_id' => $laboratory->id,
            'status' => 'completed',
        ]);
    }

    private function createInvoice(int $doctorId, float $total = 100, float $paid = 0): int
    {
        return DB::table('billing_invoices')->insertGetId([
            'invoice_number' => 'INV-' . uniqid(),
            'request_id' => random_int(1, 2_000_000_000),
            'doctor_id' => $doctorId,
            'total_amount' => number_format($total, 2, '.', ''),
            'amount_paid' => number_format($paid, 2, '.', ''),
            'status' => $paid > 0 ? 'partial' : 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

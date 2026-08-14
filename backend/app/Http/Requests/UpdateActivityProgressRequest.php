<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'progress' => ['required', 'numeric', 'min:0', 'max:100'],
            'status' => ['nullable', 'string', 'in:NOT_STARTED,IN_PROGRESS,BLOCKED,COMPLETED,CANCELLED'],
            'actual_start_date' => ['nullable', 'date'],
            'actual_end_date' => ['nullable', 'date'],
        ];
    }
}

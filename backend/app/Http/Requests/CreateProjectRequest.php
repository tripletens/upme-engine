<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'planned_start_date' => ['required', 'date'],
            'planned_end_date' => ['required', 'date', 'after_or_equal:planned_start_date'],
        ];
    }
}

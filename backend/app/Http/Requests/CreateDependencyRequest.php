<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDependencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'predecessor_activity_id' => ['required', 'integer', 'exists:activities,id'],
            'successor_activity_id' => ['required', 'integer', 'exists:activities,id', 'different:predecessor_activity_id'],
            'dependency_type' => ['nullable', 'string', 'in:FS,SS,FF,SF'],
            'lag_days' => ['nullable', 'integer'],
        ];
    }
}

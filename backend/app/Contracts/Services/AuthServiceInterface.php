<?php

namespace App\Contracts\Services;

interface AuthServiceInterface
{
    public function authenticate(string $email, string $password): array;
}

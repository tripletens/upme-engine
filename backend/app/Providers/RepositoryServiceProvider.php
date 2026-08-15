<?php

namespace App\Providers;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Contracts\Repositories\DeliverableRepositoryInterface;
use App\Contracts\Repositories\MonitoringRepositoryInterface;
use App\Contracts\Repositories\OrganizationRepositoryInterface;
use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\ActivityServiceInterface;
use App\Contracts\Services\AuthServiceInterface;
use App\Contracts\Services\BillingServiceInterface;
use App\Contracts\Services\DeliverableServiceInterface;
use App\Contracts\Services\KycServiceInterface;
use App\Contracts\Services\MonitoringEngineServiceInterface;
use App\Contracts\Services\OrganizationServiceInterface;
use App\Contracts\Services\ProjectServiceInterface;
use App\Repositories\Eloquent\EloquentActivityRepository;
use App\Repositories\Eloquent\EloquentDeliverableRepository;
use App\Repositories\Eloquent\EloquentMonitoringRepository;
use App\Repositories\Eloquent\EloquentOrganizationRepository;
use App\Repositories\Eloquent\EloquentProjectRepository;
use App\Repositories\Eloquent\EloquentUserRepository;
use App\Services\ActivityService;
use App\Services\AuthService;
use App\Services\BillingService;
use App\Services\DeliverableService;
use App\Services\KycService;
use App\Services\MonitoringEngineService;
use App\Services\OrganizationService;
use App\Services\ProjectService;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container bindings that should be registered.
     */
    public array $bindings = [
        // Repository Interfaces to Eloquent Implementations
        ProjectRepositoryInterface::class => EloquentProjectRepository::class,
        ActivityRepositoryInterface::class => EloquentActivityRepository::class,
        UserRepositoryInterface::class => EloquentUserRepository::class,
        DeliverableRepositoryInterface::class => EloquentDeliverableRepository::class,
        MonitoringRepositoryInterface::class => EloquentMonitoringRepository::class,
        OrganizationRepositoryInterface::class => EloquentOrganizationRepository::class,

        // Service Interfaces to Domain / Application Implementations
        ProjectServiceInterface::class => ProjectService::class,
        ActivityServiceInterface::class => ActivityService::class,
        AuthServiceInterface::class => AuthService::class,
        DeliverableServiceInterface::class => DeliverableService::class,
        OrganizationServiceInterface::class => OrganizationService::class,
        KycServiceInterface::class => KycService::class,
        BillingServiceInterface::class => BillingService::class,
        MonitoringEngineServiceInterface::class => MonitoringEngineService::class,
    ];

    public function register(): void
    {
        // Bindings are automatically registered via $bindings property
    }

    public function boot(): void
    {
        //
    }
}

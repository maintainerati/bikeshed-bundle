<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed;

use Maintainerati\Bikeshed\DependencyInjection\Compiler\HostnetFormHandlerPass;
use Maintainerati\Bikeshed\DependencyInjection\Compiler\LiformPass;
use Maintainerati\Bikeshed\DependencyInjection\Compiler\TwigPathsPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

final class BikeshedBundle extends Bundle
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);

        $container->addCompilerPass(new TwigPathsPass());
        $container->addCompilerPass(new LiformPass());
        $container->addCompilerPass(new HostnetFormHandlerPass());
    }
}

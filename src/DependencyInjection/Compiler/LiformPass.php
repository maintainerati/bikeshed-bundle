<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DependencyInjection\Compiler;

use Maintainerati\Bikeshed\Transformer\ButtonTransformer;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

final class LiformPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $container->getDefinition('liform.resolver')
            ->addMethodCall('setTransformer', ['submit', new Reference(ButtonTransformer::class)])
            ->addMethodCall('setTransformer', ['button', new Reference(ButtonTransformer::class)])
        ;
    }
}

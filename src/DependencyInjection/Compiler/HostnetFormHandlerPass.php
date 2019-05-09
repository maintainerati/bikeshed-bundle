<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DependencyInjection\Compiler;

use Maintainerati\Bikeshed\Form\Handler\HandlerFactory;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

final class HostnetFormHandlerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $container->getDefinition('hostnet.form_handler.factory')
            ->setClass(HandlerFactory::class)
        ;
    }
}

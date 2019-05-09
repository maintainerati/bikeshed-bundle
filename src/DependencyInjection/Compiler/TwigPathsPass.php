<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

final class TwigPathsPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        $publicPath = \dirname(__DIR__, 6) . '/public';
        $templatePath = \dirname(__DIR__, 4) . '/bikeshed/templates';

        $filesystem = $container->getDefinition('twig.loader.native_filesystem');
        $filesystem->addMethodCall('addPath', [$templatePath]);
        $filesystem->addMethodCall('addPath', [$templatePath, 'Bikeshed']);
        $filesystem->addMethodCall('addPath', [$publicPath, 'BikeshedPublic']);
    }
}

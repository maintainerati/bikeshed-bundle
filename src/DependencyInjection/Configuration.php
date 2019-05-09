<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

final class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('bikeshed');

        $treeBuilder->getRootNode()
            ->children()
                ->arrayNode('cache')
                    ->children()
                        ->booleanNode('homepage')
                            ->defaultFalse()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}

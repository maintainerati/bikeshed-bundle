<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DependencyInjection;

use Maintainerati\Bikeshed\Doctrine\DQL;
use Maintainerati\Bikeshed\Doctrine\Hydrator\ColumnHydrator;
use Maintainerati\Bikeshed\Doctrine\Hydrator\KeyPairHydrator;
use Maintainerati\Bikeshed\Entity\Attendee;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;

final class BikeshedExtension extends Extension implements PrependExtensionInterface
{
    public function prepend(ContainerBuilder $container): void
    {
        $bundles = $container->getParameter('kernel.bundles');
        $this->prependDoctrine($container, $bundles);
        $this->prependFramework($container, $bundles);
        $this->prependSecurity($container, $bundles);
        $this->prependWebpackEncore($container, $bundles);
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        $locator = new FileLocator(\dirname(__DIR__) . '/Resources/config');
        $loader = new XmlFileLoader($container, $locator);
        $loader->load('services.xml');
    }

    public function getXsdValidationBasePath()
    {
        return false;
    }

    public function getNamespace()
    {
        return 'http://maintainerati.org/schema/dic/' . $this->getAlias();
    }

    private function prependDoctrine(ContainerBuilder $container, array $bundles): void
    {
        if (!isset($bundles['DoctrineBundle'])) {
            return;
        }
        $config['orm']['dql'] = [
            'datetime_functions' => [
                'DATE' => DQL\Date::class,
            ],
            'numeric_functions' => [
                'RANDOM' => DQL\Random::class,
            ],
        ];
        $config['orm']['hydrators'] = [
            'COLUMN_HYDRATOR' => ColumnHydrator::class,
            'KEY_PAIR_HYDRATOR' => KeyPairHydrator::class,
        ];
        $config['orm']['mappings'] = [
            'BikeshedBundle' => [
                'is_bundle' => true,
                'type' => 'annotation',
                'dir' => '../../bikeshed/src/Entity/',
                'prefix' => 'Maintainerati\Bikeshed',
                'alias' => 'Bikeshed',
            ],
        ];

        $container->prependExtensionConfig('doctrine', $config);
    }

    private function prependFramework(ContainerBuilder $container, array $bundles): void
    {
        if (!isset($bundles['FrameworkBundle'])) {
            return;
        }
        $config = [
            'assets' => [
                'packages' => [
                    'bikeshed' => ['base_path' => 'bundles/bikeshed'],
                ],
            ],
        ];

        $container->prependExtensionConfig('framework', $config);
    }

    private function prependSecurity(ContainerBuilder $container, array $bundles): void
    {
        if (!isset($bundles['SecurityBundle'])) {
            return;
        }
        $config = [
            'encoders' => [
                Attendee::class => [
                    'algorithm' => 'argon2i',
                ],
            ],
            'providers' => [
                'bikeshed_user_provider' => [
                    'entity' => [
                        'class' => Attendee::class,
                        'property' => 'handle',
                    ],
                ],
            ],
        ];

        $container->prependExtensionConfig('security', $config);
    }

    private function prependWebpackEncore(ContainerBuilder $container, array $bundles): void
    {
        if (!isset($bundles['WebpackEncoreBundle'])) {
            return;
        }
        $config = [
            'builds' => [
                'Bikeshed' => '%kernel.project_dir%/public/bundles/bikeshed',
            ],
        ];

        $container->prependExtensionConfig('webpack_encore', $config);
    }
}

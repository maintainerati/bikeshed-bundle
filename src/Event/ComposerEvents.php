<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\Event;

use Composer\Script\Event as CommandEvent;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;

final class ComposerEvents
{
    private static $projectRoot;
    /** @var SymfonyStyle */
    private static $io;

    public static function postInstall(CommandEvent $event): void
    {
        self::initialise($event);
        self::$io->title('Running Bikeshed post-install tasks');
    }

    public static function postUpdate(CommandEvent $event): void
    {
        self::initialise($event);
        self::$io->title('Running Bikeshed post-update tasks');
    }

    private static function initialise(CommandEvent $event): void
    {
        try {
            $rc = new \ReflectionClass($event->getIO());
            $rp = $rc->getProperty('output');
        } catch (\ReflectionException $e) {
            throw new \RuntimeException(
                sprintf('Unable to get %s from Composer event object.', ConsoleOutput::class),
                $e->getCode(),
                $e
            );
        }
        $rp->setAccessible(true);
        $io = $rp->getValue($event->getIO());

        self::$io = new SymfonyStyle(new ArgvInput(), $io);

        $vendorPath = $event->getComposer()->getConfig()->get('vendor-dir');
        self::$projectRoot = realpath(\dirname($vendorPath));
    }
}

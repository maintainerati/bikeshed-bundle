<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\DataFixtures;

use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Maintainerati\Bikeshed\Entity\Attendee;
use Maintainerati\Bikeshed\Entity\Event;
use Maintainerati\Bikeshed\Entity\Note;
use Maintainerati\Bikeshed\Entity\Session;
use Maintainerati\Bikeshed\Entity\Space;
use Maintainerati\Bikeshed\Util\LoremIpsum;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class BikeshedFixtures extends Fixture
{
    /** @var UserPasswordEncoderInterface */
    private $passwordEncoder;
    /** @var LoremIpsum */
    private $loremIpsum;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder, LoremIpsum $loremIpsum)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->loremIpsum = $loremIpsum;
    }

    public function load(ObjectManager $manager): void
    {
        $attendees = [
            (new Attendee())
                ->setEmail('neo@maintainerati.test')
                ->setHandle('NeoAnderson')
                ->setFirstName('Neo')
                ->setLastName('Anderson')
                ->setPlainPassword('no more secrets')
                ->setPasswordExpires(new DateTimeImmutable('+1 month'))
                ->setRoles(['ROLE_USER']),
            (new Attendee())
                ->setEmail('two@maintainerati.test')
                ->setHandle('PairAces')
                ->setFirstName('Pair')
                ->setLastName('Aces')
                ->setPlainPassword('hunter42')
                ->setPasswordExpires(new DateTimeImmutable('+1 month'))
                ->setRoles(['ROLE_USER']),
        ];
        /** @var Attendee $attendee */
        foreach ($attendees as $attendee) {
            $attendee->setPassword($this->passwordEncoder->encodePassword($attendee, $attendee->getPlainPassword()));
            $manager->persist($attendee);
        }

        $this->addEventBerlin($manager, $attendees);
        $this->addEventNetherlands($manager, $attendees);

        $manager->flush();
    }

    /**
     * @param Attendee[] $attendees
     */
    private function addEventBerlin(ObjectManager $manager, $attendees): void
    {
        $event = new Event();
        $event->setDate(new DateTimeImmutable('+7 days'));
        $event->setCountry('DE');
        $event->setCity('Berlin');
        $event->setLocation('Spreespeicher');

        $times = ['09:00' => '10:30', '10:30' => '12:00', '14:00' => '15:30'];
        foreach ($times as $start => $end) {
            $this->addSession($manager, $event, $start, $end, $attendees);
        }

        $manager->persist($event);
    }

    /**
     * @param Attendee[] $attendees
     */
    private function addEventNetherlands(ObjectManager $manager, $attendees): void
    {
        $event = new Event();
        $event->setDate(new DateTimeImmutable('+25 days'));
        $event->setCountry('NL');
        $event->setCity('The Hague');
        $event->setLocation('Het Plein');

        $times = ['10:00' => '11:00', '11:00' => '12:00', '13:00' => '14:00'];
        foreach ($times as $start => $end) {
            $this->addSession($manager, $event, $start, $end, $attendees);
        }

        $manager->persist($event);
    }

    /**
     * @param Attendee[] $attendees
     */
    private function addSession(ObjectManager $manager, Event $event, string $start, string $end, array $attendees): void
    {
        $session = new Session();
        $session->setStartTime(new DateTimeImmutable($start));
        $session->setEndTime(new DateTimeImmutable($end));
        $session->setEvent($event);

        foreach (['A', 'B'] as $v) {
            $this->addSpace($manager, $session, "$start $v Space", $attendees);
        }

        $manager->persist($session);
    }

    /**
     * @param Attendee[] $attendees
     */
    private function addSpace(ObjectManager $manager, Session $session, string $spaceName, array $attendees): void
    {
        $space = new Space();
        $space->setName($spaceName);
        $space->setTopic("Discussions in $spaceName");
        $space->setSession($session);

        foreach ($attendees as $attendee) {
            $space->addAttendee($attendee);
            $this->addNote($manager, $attendee, $space);
            $this->addNote($manager, $attendee, $space);
        }

        $manager->persist($space);
    }

    private function addNote(ObjectManager $manager, Attendee $attendee, Space $space): void
    {
        $note = new Note();
        $note->setDate(new DateTimeImmutable(random_int(10, 3000) . ' seconds ago'));
        $note->setAttendee($attendee);
        $note->setSpace($space);
        $note->setNote($this->loremIpsum->getBody());

        $manager->persist($note);
    }
}

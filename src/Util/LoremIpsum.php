<?php

declare(strict_types=1);

namespace Maintainerati\Bikeshed\Util;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class LoremIpsum
{
    private const API = 'https://loripsum.net/api';
    /** @var HttpClientInterface */
    private $client;

    public function __construct()
    {
        $this->client = HttpClient::create();
    }

    /**
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getTitle(): string
    {
        $response = $this->client->request(Request::METHOD_GET, self::API . '/1/short/plaintext');

        return $response->getContent();
    }

    /**
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getBody($lines = 3): string
    {
        $response = $this->client->request(Request::METHOD_GET, self::API . "/$lines/short/plaintext");
        $content = $response->getContent();

        return ltrim(substr($content, strpos($content, '.') + 1), ' ');
    }
}

<?php

// 参考 https://haruue.moe/blog/2016/10/06/render-markdown-with-github/

class RepoViewProxy
{
    public $githubRawUrl = '';
    public $githubMarkdownUrl = '';
    public $repository = '';
    public $branch = '';
    public $proxy = '';
    protected $filepath = '';
    protected $footer = '';

    function __construct(array $config)
    {
        $this->githubRawUrl = $config['githubRawUrl'] ?? '';
        $this->githubMarkdownUrl = $config['githubMarkdownUrl'] ?? '';
        $this->repository = $config['repository'] ?? '';
        $this->branch = $config['branch'] ?? '';
        $this->proxy = $config['proxy'] ?? '';
        $this->footer = $config['footer'] ?? '';
    }

    /**
     * @return resource|false|CurlHandle
     */
    protected function getCurl(string $path)
    {
        $curl = curl_init($path);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        if (!empty($this->proxy)) {
            $proxy = parse_url($this->proxy);
            if (is_array($proxy)) {
                isset($proxy['port']) ? curl_setopt($curl, CURLOPT_PROXYPORT, $proxy['port']) : null;
                isset($proxy['host']) ? curl_setopt($curl, CURLOPT_PROXY, $proxy['host']) : null;
                $scheme = isset($proxy['scheme']) ? $proxy['scheme'] : null;
                switch ($scheme) {
                    case 'http':
                        curl_setopt($curl, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5_HOSTNAME);
                        break;
                    case 'https':
                        curl_setopt($curl, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5_HOSTNAME);
                        break;
                    case 'socks5':
                        curl_setopt($curl, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5_HOSTNAME);
                        break;
                }
            }
        }
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        return $curl;
    }

    public function getPath(string $path): string
    {
        if (substr($path, 0, 1) != '/') {
            $path = '/' . $path;
        }
        $prefix = '/' . $this->repository . '/' . $this->branch;
        if (filter_var($path, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/^' . preg_quote($prefix, '/') . '/']])) {
            $filepath = $this->githubRawUrl . $path;
        } else {
            $filepath = $this->githubRawUrl . $prefix . $path;
        }
        $this->filepath = $filepath;
        return $filepath;
    }

    public function getFile(string $path): string
    {
        $curl = $this->getCurl($this->getPath($path));
        return curl_exec($curl);
    }

    public function renderMarkdown(string $markdown): string
    {
        $content = json_encode([
            'text' => $markdown,
            'mode' => 'markdown',
        ]);
        $ua = (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49');
        $curl = $this->getCurl($this->githubMarkdownUrl);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            [
                'Content-type: application/json',
                'User-Agent: ' . $ua
            ]
        );
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
        return curl_exec($curl);
    }

    public function renderTpl(string $html): string
    {
        $html = trim($html);
        $title = basename($this->filepath);
        preg_match('/<h1>(.*)<\/h1>/s', $html, $match);
        if (is_array($match) && count($match) > 0) {
            $titleh1 = trim(strip_tags($match[0]));
            if (!empty($titleh1)) {
                $title = $titleh1;
            }
        }
        $title = trim($title);

        $footer = trim($this->footer);
        if (!empty($footer)) {
            $footer = '<hr><footer><small>' . $footer . '</small><footer>';
        }

        $tpl = <<<EOF
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>$title</title>
</head>
<article class="markdown-body">
$html
</article>
</body>
$footer
</html>
EOF;

        return $tpl;
    }

    public function builtServer(string $filepath)
    {
        if (filter_var($filepath, FILTER_VALIDATE_REGEXP, ['options' => ['regexp' => '/(.*)\.md$/']])) {
            $content = $this->renderTpl($this->renderMarkdown($this->getFile($filepath)));
            header('content-length: ' . strlen($content));
            header('content-type: text/html; charset=utf-8');
            echo $content;
            exit(0);
        }

        $curl = $this->getCurl($this->getPath($filepath));
        $content = curl_exec($curl);
        $curlInfo = curl_getinfo($curl);
        if (!empty($curlInfo['content_type'])) {
            header('content-type: ' . $curlInfo['content_type']);
        } else {
            header('content-type: application/octet-stream');
        }
        header('content-length: ' . strlen($content));
        // "download_content_length"
        echo $content;
    }
}

$config = [
    'githubRawUrl' => 'https://raw.githubusercontent.com',
    'githubMarkdownUrl' => 'https://api.github.com/markdown',
    'repository' => 'WeNeedHome/SummaryOfLoanSuspension',
    'branch' => 'main',
    'proxy' => 'socks5://127.0.0.1:6080',
    'footer' => '
    以上数据来源：
    <a target="_blank" href="https://github.com/WeNeedHome/SummaryOfLoanSuspension">https://github.com/WeNeedHome/SummaryOfLoanSuspension</a>
    <br>
    本站无法保证上述数据的真实性，如有相关问题请向数据提供方咨询。
    '
];

$filepath = $_SERVER['REQUEST_URI'] ?? '';
if (empty($filepath) || $filepath == '/' || $filepath == 'README.md') {
    $filepath = 'README.md';
}

$repoViewProxy = new RepoViewProxy($config);

if (PHP_SAPI == 'cli-server') {
    $repoViewProxy->builtServer($filepath);
} else {
    echo $repoViewProxy->renderTpl($repoViewProxy->renderMarkdown($repoViewProxy->getFile($filepath)));
}

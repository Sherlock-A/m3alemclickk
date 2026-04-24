<?php

namespace App\Helpers;

class SeoHelper
{
    private string $title       = 'M3allemClick';
    private string $description = 'Trouvez un artisan ou professionnel qualifié au Maroc en moins de 30 secondes.';
    private string $url         = '';
    private string $image       = '';
    private string $locale      = 'fr_MA';
    private string $type        = 'website';

    /** @var array<array<string,mixed>> */
    private array $schemas = [];

    public static function make(): self
    {
        return new self();
    }

    public function title(string $title): self
    {
        $this->title = $title . ' — M3allemClick';
        return $this;
    }

    public function rawTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function description(string $desc): self
    {
        $this->description = mb_substr(strip_tags($desc), 0, 160);
        return $this;
    }

    public function url(string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function image(string $image): self
    {
        $this->image = $image;
        return $this;
    }

    public function locale(string $locale): self
    {
        $this->locale = $locale;
        return $this;
    }

    public function type(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    // ─── JSON-LD schemas ──────────────────────────────────────────────────────

    /**
     * Add a LocalBusiness / Person schema for a professional profile page.
     *
     * @param  array{name:string, profession:string, main_city:string, description:string|null, photo:string|null, phone:string|null, rating:float|null, slug:string}  $pro
     */
    public function professionalSchema(array $pro): self
    {
        $base = config('app.url');

        $schema = [
            '@context' => 'https://schema.org',
            '@type'    => 'LocalBusiness',
            'name'     => $pro['name'],
            'jobTitle' => $pro['profession'],
            'address'  => [
                '@type'           => 'PostalAddress',
                'addressLocality' => $pro['main_city'],
                'addressCountry'  => 'MA',
            ],
            'url' => "{$base}/professionals/{$pro['slug']}",
        ];

        if (! empty($pro['description'])) {
            $schema['description'] = mb_substr(strip_tags($pro['description']), 0, 300);
        }
        if (! empty($pro['photo'])) {
            $schema['image'] = $pro['photo'];
        }
        if (! empty($pro['phone'])) {
            $schema['telephone'] = $pro['phone'];
        }
        if (! empty($pro['rating'])) {
            $schema['aggregateRating'] = [
                '@type'       => 'AggregateRating',
                'ratingValue' => number_format((float) $pro['rating'], 1),
                'bestRating'  => '5',
                'worstRating' => '1',
            ];
        }

        $this->schemas[] = $schema;
        return $this;
    }

    /**
     * Add a WebSite schema with SearchAction (enables Google Sitelinks Searchbox).
     */
    public function websiteSchema(): self
    {
        $base = config('app.url');

        $this->schemas[] = [
            '@context'        => 'https://schema.org',
            '@type'           => 'WebSite',
            'name'            => 'M3allemClick',
            'url'             => $base,
            'potentialAction' => [
                '@type'       => 'SearchAction',
                'target'      => [
                    '@type'       => 'EntryPoint',
                    'urlTemplate' => "{$base}/professionals?search={search_term_string}",
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];

        return $this;
    }

    /**
     * Add a BreadcrumbList schema.
     *
     * @param  array<array{name:string, url:string}>  $items
     */
    public function breadcrumbs(array $items): self
    {
        $list = [];
        foreach ($items as $i => $item) {
            $list[] = [
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $item['name'],
                'item'     => $item['url'],
            ];
        }

        $this->schemas[] = [
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => $list,
        ];

        return $this;
    }

    // ─── Output ───────────────────────────────────────────────────────────────

    /**
     * Render all <meta> and <script type="application/ld+json"> tags as HTML.
     */
    public function render(): string
    {
        $url   = $this->url ?: config('app.url');
        $image = $this->image ?: (config('app.url') . '/images/og-default.jpg');
        $title = htmlspecialchars($this->title, ENT_QUOTES, 'UTF-8');
        $desc  = htmlspecialchars($this->description, ENT_QUOTES, 'UTF-8');

        $html  = "<title>{$title}</title>\n";
        $html .= "<meta name=\"description\" content=\"{$desc}\">\n";
        $html .= "<meta name=\"robots\" content=\"index, follow\">\n";
        $html .= "<link rel=\"canonical\" href=\"{$url}\">\n";

        // Open Graph
        $html .= "<meta property=\"og:title\" content=\"{$title}\">\n";
        $html .= "<meta property=\"og:description\" content=\"{$desc}\">\n";
        $html .= "<meta property=\"og:url\" content=\"{$url}\">\n";
        $html .= "<meta property=\"og:type\" content=\"{$this->type}\">\n";
        $html .= "<meta property=\"og:image\" content=\"{$image}\">\n";
        $html .= "<meta property=\"og:locale\" content=\"{$this->locale}\">\n";
        $html .= "<meta property=\"og:site_name\" content=\"M3allemClick\">\n";

        // Twitter Card
        $html .= "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
        $html .= "<meta name=\"twitter:title\" content=\"{$title}\">\n";
        $html .= "<meta name=\"twitter:description\" content=\"{$desc}\">\n";
        $html .= "<meta name=\"twitter:image\" content=\"{$image}\">\n";

        // JSON-LD schemas
        foreach ($this->schemas as $schema) {
            $json  = json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
            $html .= "<script type=\"application/ld+json\">\n{$json}\n</script>\n";
        }

        return $html;
    }

    /**
     * Return structured data as an array for Inertia's `seo` prop.
     * The React head component renders these values into <head>.
     *
     * @return array{title:string, description:string, url:string, image:string, type:string, schemas:array<mixed>}
     */
    public function toArray(): array
    {
        return [
            'title'       => $this->title,
            'description' => $this->description,
            'url'         => $this->url ?: config('app.url'),
            'image'       => $this->image ?: (config('app.url') . '/images/og-default.jpg'),
            'type'        => $this->type,
            'schemas'     => $this->schemas,
        ];
    }
}

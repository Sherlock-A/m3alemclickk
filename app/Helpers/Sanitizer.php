<?php

namespace App\Helpers;

class Sanitizer
{
    /**
     * Strip all HTML tags and encode special characters.
     * Safe for plain-text output or database storage.
     */
    public static function clean(string $value): string
    {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Allow a minimal set of safe HTML tags (bold, italic, links, line-breaks).
     * Use for user-supplied rich-text fields that are rendered as HTML.
     */
    public static function allowBasicHtml(string $value): string
    {
        $allowed = '<b><strong><i><em><u><br><p><ul><ol><li><a>';
        $stripped = strip_tags($value, $allowed);

        // Remove dangerous attributes (onclick, onerror, javascript:, data:, etc.)
        return preg_replace(
            '/(<[^>]+)\s+(on\w+|style|class|id)\s*=\s*["\'][^"\']*["\']/i',
            '$1',
            $stripped
        ) ?? $stripped;
    }

    /**
     * Sanitize a phone number — keep only digits, +, -, spaces, and parentheses.
     */
    public static function phone(string $value): string
    {
        return preg_replace('/[^\d\+\-\s\(\)]/', '', $value) ?? '';
    }

    /**
     * Sanitize a slug — lowercase, alphanumeric + hyphens only.
     */
    public static function slug(string $value): string
    {
        $value = mb_strtolower($value, 'UTF-8');
        $value = preg_replace('/[^a-z0-9\-]/', '-', $value) ?? $value;
        return trim(preg_replace('/-+/', '-', $value) ?? $value, '-');
    }

    /**
     * Escape a value for safe inclusion inside a JSON string
     * (when building JSON responses manually).
     */
    public static function jsonEscape(string $value): string
    {
        return addslashes(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
    }

    /**
     * Batch-clean an array of strings. Preserves keys.
     *
     * @param  array<string, mixed>  $data
     * @param  string[]              $fields  keys to sanitize (all if empty)
     * @return array<string, mixed>
     */
    public static function cleanArray(array $data, array $fields = []): array
    {
        foreach ($data as $key => $value) {
            if (! empty($fields) && ! in_array($key, $fields, true)) {
                continue;
            }
            if (is_string($value)) {
                $data[$key] = self::clean($value);
            }
        }
        return $data;
    }
}

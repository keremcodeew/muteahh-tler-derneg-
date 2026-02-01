<?php
/*
Plugin Name: AMD AI Blog Scheduler
Description: Başlık + tarih/saat girerek OpenAI ile otomatik blog yazısı oluşturur ve WordPress yazısı olarak yayınlar.
Version: 0.1.0
Author: SoftwareOfFuture
*/

if (!defined('ABSPATH')) exit;

define('AMD_AI_BLOG_OPT', 'amd_ai_blog_options');
define('AMD_AI_BLOG_TASKS', 'amd_ai_blog_tasks');
define('AMD_AI_BLOG_CRON_HOOK', 'amd_ai_blog_run_due');

function amd_ai_blog_get_opts() {
  $opts = get_option(AMD_AI_BLOG_OPT, array());
  return is_array($opts) ? $opts : array();
}

function amd_ai_blog_save_opts($opts) {
  update_option(AMD_AI_BLOG_OPT, $opts);
}

function amd_ai_blog_get_tasks() {
  $tasks = get_option(AMD_AI_BLOG_TASKS, array());
  return is_array($tasks) ? $tasks : array();
}

function amd_ai_blog_save_tasks($tasks) {
  update_option(AMD_AI_BLOG_TASKS, $tasks);
}

function amd_ai_blog_admin_menu() {
  add_menu_page(
    'AMD AI Blog',
    'AMD AI Blog',
    'manage_options',
    'amd-ai-blog',
    'amd_ai_blog_admin_page',
    'dashicons-edit',
    80
  );
}
add_action('admin_menu', 'amd_ai_blog_admin_menu');

function amd_ai_blog_admin_page() {
  if (!current_user_can('manage_options')) return;

  $opts = amd_ai_blog_get_opts();
  $tasks = amd_ai_blog_get_tasks();

  // Save settings
  if (isset($_POST['amd_ai_blog_save_settings'])) {
    check_admin_referer('amd_ai_blog_settings');
    $opts['gemini_api_key'] = sanitize_text_field($_POST['gemini_api_key']);
    $opts['gemini_model'] = sanitize_text_field($_POST['gemini_model']);
    amd_ai_blog_save_opts($opts);
    echo '<div class="updated"><p>Ayarlar kaydedildi.</p></div>';
  }

  // Add task
  if (isset($_POST['amd_ai_blog_add_task'])) {
    check_admin_referer('amd_ai_blog_tasks');
    $title = sanitize_text_field($_POST['title']);
    $publish_at = sanitize_text_field($_POST['publish_at']); // ISO-like local
    if ($title && $publish_at) {
      $id = time() . '_' . wp_rand(1000, 9999);
      $tasks[$id] = array(
        'id' => $id,
        'title' => $title,
        'publish_at' => $publish_at,
        'status' => 'scheduled',
        'last_error' => '',
        'post_id' => 0,
      );
      amd_ai_blog_save_tasks($tasks);
      echo '<div class="updated"><p>İş eklendi.</p></div>';
    } else {
      echo '<div class="error"><p>Başlık ve tarih/saat zorunlu.</p></div>';
    }
  }

  // Delete task
  if (isset($_POST['amd_ai_blog_delete_task'])) {
    check_admin_referer('amd_ai_blog_tasks');
    $tid = sanitize_text_field($_POST['task_id']);
    if (isset($tasks[$tid])) {
      unset($tasks[$tid]);
      amd_ai_blog_save_tasks($tasks);
      echo '<div class="updated"><p>İş silindi.</p></div>';
    }
  }

  // Run now
  if (isset($_POST['amd_ai_blog_run_now'])) {
    check_admin_referer('amd_ai_blog_tasks');
    amd_ai_blog_run_due();
    $tasks = amd_ai_blog_get_tasks();
    echo '<div class="updated"><p>Çalıştırıldı (due işler işlendi).</p></div>';
  }

  ?>
  <div class="wrap">
    <h1>AMD AI Blog</h1>

    <h2>Ayarlar</h2>
    <form method="post">
      <?php wp_nonce_field('amd_ai_blog_settings'); ?>
      <table class="form-table">
        <tr>
          <th scope="row">Google AI Studio (Gemini) API Key</th>
          <td><input type="password" name="gemini_api_key" value="<?php echo esc_attr(isset($opts['gemini_api_key']) ? $opts['gemini_api_key'] : ''); ?>" class="regular-text" /></td>
        </tr>
        <tr>
          <th scope="row">Model</th>
          <td><input type="text" name="gemini_model" value="<?php echo esc_attr(isset($opts['gemini_model']) ? $opts['gemini_model'] : 'gemini-1.5-flash'); ?>" class="regular-text" /></td>
        </tr>
      </table>
      <p><button type="submit" name="amd_ai_blog_save_settings" class="button button-primary">Kaydet</button></p>
    </form>

    <hr />
    <h2>Zamanlanmış İş Ekle</h2>
    <form method="post">
      <?php wp_nonce_field('amd_ai_blog_tasks'); ?>
      <table class="form-table">
        <tr>
          <th scope="row">Başlık</th>
          <td><input type="text" name="title" class="regular-text" placeholder="Örn. 2026 İnşaat Trendleri" /></td>
        </tr>
        <tr>
          <th scope="row">Tarih/Saat</th>
          <td><input type="datetime-local" name="publish_at" /></td>
        </tr>
      </table>
      <p>
        <button type="submit" name="amd_ai_blog_add_task" class="button button-primary">Ekle</button>
        <button type="submit" name="amd_ai_blog_run_now" class="button">Şimdi Çalıştır</button>
      </p>
    </form>

    <h2>İşler</h2>
    <table class="widefat fixed striped">
      <thead>
        <tr>
          <th>Başlık</th>
          <th>Planlanan</th>
          <th>Durum</th>
          <th>Post</th>
          <th>Hata</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($tasks)) : ?>
          <tr><td colspan="6">Kayıt yok.</td></tr>
        <?php else: foreach ($tasks as $t): ?>
          <tr>
            <td><?php echo esc_html($t['title']); ?></td>
            <td><?php echo esc_html($t['publish_at']); ?></td>
            <td><?php echo esc_html($t['status']); ?></td>
            <td>
              <?php if (!empty($t['post_id'])): ?>
                <a href="<?php echo esc_url(get_edit_post_link(intval($t['post_id']))); ?>">#<?php echo intval($t['post_id']); ?></a>
              <?php else: ?>
                —
              <?php endif; ?>
            </td>
            <td><?php echo esc_html(isset($t['last_error']) ? $t['last_error'] : ''); ?></td>
            <td>
              <form method="post" style="display:inline">
                <?php wp_nonce_field('amd_ai_blog_tasks'); ?>
                <input type="hidden" name="task_id" value="<?php echo esc_attr($t['id']); ?>" />
                <button type="submit" name="amd_ai_blog_delete_task" class="button button-link-delete">Sil</button>
              </form>
            </td>
          </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
  <?php
}

function amd_ai_blog_schedule_cron() {
  if (!wp_next_scheduled(AMD_AI_BLOG_CRON_HOOK)) {
    wp_schedule_event(time() + 60, 'five_minutes', AMD_AI_BLOG_CRON_HOOK);
  }
}
register_activation_hook(__FILE__, 'amd_ai_blog_schedule_cron');

function amd_ai_blog_clear_cron() {
  $timestamp = wp_next_scheduled(AMD_AI_BLOG_CRON_HOOK);
  if ($timestamp) wp_unschedule_event($timestamp, AMD_AI_BLOG_CRON_HOOK);
}
register_deactivation_hook(__FILE__, 'amd_ai_blog_clear_cron');

add_filter('cron_schedules', function($schedules) {
  if (!isset($schedules['five_minutes'])) {
    $schedules['five_minutes'] = array('interval' => 300, 'display' => 'Every 5 minutes');
  }
  return $schedules;
});

add_action(AMD_AI_BLOG_CRON_HOOK, 'amd_ai_blog_run_due');

function amd_ai_blog_run_due() {
  $opts = amd_ai_blog_get_opts();
  $api_key = isset($opts['gemini_api_key']) ? $opts['gemini_api_key'] : '';
  if (!$api_key) return;

  $model = isset($opts['gemini_model']) && $opts['gemini_model'] ? $opts['gemini_model'] : 'gemini-1.5-flash';
  $tasks = amd_ai_blog_get_tasks();

  $now = current_time('timestamp'); // WP timezone

  foreach ($tasks as $id => $t) {
    if (!isset($t['status']) || $t['status'] !== 'scheduled') continue;
    $ts = strtotime($t['publish_at']);
    if (!$ts) continue;
    if ($ts > $now) continue;

    $tasks[$id]['status'] = 'running';
    amd_ai_blog_save_tasks($tasks);

    $content = amd_ai_blog_generate_post($api_key, $model, $t['title']);
    if (is_wp_error($content)) {
      $tasks[$id]['status'] = 'failed';
      $tasks[$id]['last_error'] = $content->get_error_message();
      amd_ai_blog_save_tasks($tasks);
      continue;
    }

    $post_id = wp_insert_post(array(
      'post_title' => $t['title'],
      'post_content' => $content,
      'post_status' => 'publish',
      'post_type' => 'post',
    ), true);

    if (is_wp_error($post_id)) {
      $tasks[$id]['status'] = 'failed';
      $tasks[$id]['last_error'] = $post_id->get_error_message();
      amd_ai_blog_save_tasks($tasks);
      continue;
    }

    $tasks[$id]['status'] = 'published';
    $tasks[$id]['post_id'] = intval($post_id);
    $tasks[$id]['last_error'] = '';
    amd_ai_blog_save_tasks($tasks);
  }
}

function amd_ai_blog_generate_post($api_key, $model, $title) {
  $sys = "You are an expert Turkish corporate content writer. Write original content. Use headings and lists.";
  $user = "Topic: " . $title . "\nLanguage: tr\nTone: kurumsal, bilgilendirici\nReturn Markdown.";

  $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($api_key);
  $resp = wp_remote_post($url, array(
    'timeout' => 60,
    'headers' => array(
      'Content-Type' => 'application/json',
    ),
    'body' => wp_json_encode(array(
      'systemInstruction' => array('parts' => array(array('text' => $sys))),
      'contents' => array(
        array('role' => 'user', 'parts' => array(array('text' => $user))),
      ),
      'generationConfig' => array(
        'temperature' => 0.7,
      ),
    )),
  ));

  if (is_wp_error($resp)) return $resp;
  $code = wp_remote_retrieve_response_code($resp);
  $body = wp_remote_retrieve_body($resp);
  $data = json_decode($body, true);
  if ($code < 200 || $code >= 300) {
    $msg = isset($data['error']['message']) ? $data['error']['message'] : 'Gemini error';
    return new WP_Error('gemini_error', $msg);
  }
  $text = '';
  if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
    $text = $data['candidates'][0]['content']['parts'][0]['text'];
  }
  if (!$text) return new WP_Error('gemini_empty', 'Gemini boş çıktı döndü.');
  return $text;
}


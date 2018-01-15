<?php 
/*
######################################################################
PHP main class for Typesetter CMS Addon Lazy Loading Sections
Author: J. Krausz
Date: 2018-01-15
Version 1.0-b2
######################################################################
*/

defined('is_running') or die('Not an entry point...');

class LazyLoadingSections
{

  /*
   * Typesetter Action Hook
   *
   */
  static function GetHead(){
    global $page, $addonRelativeCode;
    \gp\tool::LoadComponents('fontawesome');
    $page->css_user[] = $addonRelativeCode . '/LazyLoadingSections.css';
    $page->head_js[]  = $addonRelativeCode . '/thirdparty/jquery-visible/jquery.visible.min.js';
    $page->head_js[]  = $addonRelativeCode . '/LazyLoadingSections.js';
  }



  /*
   * Typesetter Filter Hook
   *
   */
  static function SectionToContent($section_data, $section_num){
    global $page, $addonRelativeCode;
    if( \gp\tool::LoggedIn() || isset($_SESSION['noLazyLoading']) || !isset($section_data['lazy_section']) ){
      return $section_data;
    }
    
    $data_attr  = ' data-lazy-url="' . \gp\tool::GetUrl($page->title) . '?lazy_section=' . $section_data['lazy_section'] . '&type=' . $section_data['type'] . '"'
                . ' data-lazy-section="' . $section_data['lazy_section'] . '"';
    $section_data['content']  = '<div class="lazy-section-placeholder"' . $data_attr . '><i class="fa fa-ellipsis-h fa-fw"></i>';
    $section_data['content'] .= '<noscript>';
    $section_data['content'] .= '<h3>Lazy Loading Content</h3>';
    $section_data['content'] .= '<p>Please enable JavaScript or ';
    $section_data['content'] .= '  <a href="' .  \gp\tool::GetUrl($page->title) . '?disable-lazy-loading">click here</a>';
    $section_data['content'] .= '  to disable Lazy Loading (using a Session Cookie).</p>';
    $section_data['content'] .= '</noscript>';
    $section_data['content'] .= '</div>';

    return $section_data;
  }



  /*
   * Typesetter Filter Hook
   *
   */
  static function SaveSection($return, $section_num, $type){
    global $page;
    $section = $page->file_sections[$section_num];
    $lazy_section_id = \gp\tool::RandomString(8);
    if( $section['type'] != 'wrapper_section' && isset($section['attributes']['class']) && strpos($section['attributes']['class'], 'lazy-loading-section') !== false ){
      $page->file_sections[$section_num]['lazy_section'] = $lazy_section_id;
    }
    return $return;
  }



  /*
   * Typesetter Filter Hook
   *
   */
  static function PageRunScript($cmd){
    global $page;
    if( !\gp\tool::LoggedIn() && isset($_GET['disable-lazy-loading']) ){
      session_start();
      $_SESSION['noLazyLoading'] = true;
    }
    if( !\gp\tool::LoggedIn() && isset($_GET['jsoncallback']) && isset($_GET['lazy_section']) ){
      $page->GetFile();
      $lazy_section_id = $_GET['lazy_section'];
      $found = false;
      foreach( $page->file_sections as $section_num => $section_data ){
        if( isset($section_data['lazy_section']) && $section_data['lazy_section'] == $lazy_section_id ){
          $found = $section_num;
          break;
        }
      }
      if( $found === false ){
        return $cmd;
      }
      $jsoncallback   = $_GET['jsoncallback'];
      $section_type   = isset($_GET['type']) ? $_GET['type'] : '';
      $section_data = $page->file_sections[$section_num];
      // unset lazy_section in $section array to prevent anew content replacement in SectionToContent plugin filter
      unset($section_data['lazy_section']); 
      $response   = array(
        'DO'        => 'replace',
        'SELECTOR'  => '.lazy-section-placeholder[data-lazy-section="' . $lazy_section_id . '"]',
        'CONTENT'   => \gp\tool\Output\Sections::SectionToContent($section_data, $section_num),
      );
      exit( $jsoncallback . '([' . \gp\tool::JsonEncode($response) . ']);' ); 
    }
    return $cmd;
  }


}

<?php
    /*
    * Echo an iCalendar for jquery.icalendar.js
    *
    * Written by Keith Wood (kbwood{at}iinet.com.au) July 2008
    */
    ini_set("display_errors", 1);
    error_reporting(E_ALL & ~E_NOTICE);

    $content = $_GET["content"];
    
    header('HTTP/1.0 200 OK', true, 200);
    header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($fn)).' GMT', true, 200);
    header("Content-length: ".strlen($content));
    header("Content-type: text/calendar");
    header("Content-disposition: attachment; filename=derniermetro.ics");
    
    echo $content;
?>

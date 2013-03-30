<?php
    /*
    * Echo an iCalendar for jquery.icalendar.js
    *
    * Written by Keith Wood (kbwood{at}iinet.com.au) July 2008
    */
    ini_set("display_errors", 1);
    error_reporting(E_ALL & ~E_NOTICE);

    $content = $_GET["content"];
    header("Content-type: text/calendar");
    header("Content-length: ".strlen($content));
    header("Content-disposition: attachment; filename=derniermetro.ics");
    echo $content;
?>

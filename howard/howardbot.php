<?php
/**
 * $Id: example.php,v 1.3.2.1 2004/12/20 15:54:51 meebey Exp $
 * $Revision: 1.3.2.1 $
 * $Author: meebey $
 * $Date: 2004/12/20 15:54:51 $
 *
 * Copyright (c) 2002-2003 Mirco "MEEBEY" Bauer <mail@meebey.net> <http://www.meebey.net>
 * 
 * Full LGPL License: <http://www.meebey.net/lgpl.txt>
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */
// ---EXAMPLE OF HOW TO USE Net_SmartIRC---
// this code shows how a mini php bot which could be written
include_once('SmartIRC.php');

echo('testbot reporting for duty!');

class mybot
{
    private $usernames = array('susan','kdel','jhurliman','jesse','blair','aherbez');
    
    function channel_test(&$irc, &$data)
    {
        echo(print_r($data));
        $irc->message(SMARTIRC_TYPE_CHANNEL, $data->channel, $data->nick.': I dont like tests!');
    }
    
    function go_away(&$irc, &$data)
    {
        echo('leaving');
        $irc->message(SMARTIRC_TYPE_CHANNEL, $data->channel, 'going away now');
        $irc->quit();
    }
    
    function send_love(&$irc, &$data)
    {
        $msg = $data->message;
        $parts = explode(' ',$msg);
        
        $to = mysql_real_escape_string($parts[1]);
        
        $reason = '';
        
        for ($i=2; $i<count($parts);$i++)
        {
            $reason .= $parts[$i];
            if ($i < count($parts)-1)
            {
                $reason .= ' ';
            }
        }
        
        $from = $data->nick;
        $response = $from .' sent love to: ' . $to . ' for: ' . $reason;

        $reason = mysql_real_escape_string($reason);
        
        $link = mysql_connect('mysql.adrianherbez.net', 'aherbez_love', 'vnzDCrrJ');
        if (!$link) {
            die('Could not connect: ' . mysql_error());
        }
        mysql_select_db('aherbez_lovedb');
        
        $to = strtolower(trim($to));
        
        // make sure the recipient is real
        if (in_array($to,$this->usernames))
        {
            $query = "insert into love (user_from,user_to,reason,time_sent) values ('$from','$to','$reason',now());";
            echo($query);
            mysql_query($query);            
        }
        else
        {
            $response = 'username not recognized. known users: ' . join(' ',$this->usernames);
        }
        
        mysql_close($link);        
        
        
        $irc->message(SMARTIRC_TYPE_CHANNEL, $data->channel, $response);   
    }

    function query_test(&$irc, &$data)
    {
        // result is send to #smartirc-test (we don't want to spam #test)
        $irc->message(SMARTIRC_TYPE_CHANNEL, '#culltv', $data->nick.' said "'.$data->message.'" to me!');
        $irc->message(SMARTIRC_TYPE_QUERY, $data->nick, 'I told everyone on #smartirc-test what you said!');
    }
}

$bot = &new mybot();
$irc = &new Net_SmartIRC();
$irc->setDebug(SMARTIRC_DEBUG_ALL);
$irc->setUseSockets(TRUE);
$irc->registerActionhandler(SMARTIRC_TYPE_CHANNEL, '^nobots', $bot, 'go_away');
$irc->registerActionhandler(SMARTIRC_TYPE_CHANNEL, '^love', $bot, 'send_love');
$irc->connect('irc.cull.tv', 5000);
$irc->login('howard', 'Net_SmartIRC Client '.SMARTIRC_VERSION.' (example.php)', 0, 'Net_SmartIRC');
$irc->join(array('#culltv'));
$irc->listen();
$irc->disconnect();
?>

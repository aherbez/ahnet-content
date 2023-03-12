<?php

class Place
{
    protected $lat;
    protected $long;
    
    protected $x;
    protected $y;
    
    public function __construct($lat = 0,$long = 0)
    {
        $this->lat = $lat;
        $this->long = $long;
        
        // prep position for use in a planar cylindrical mapping
        
        /*
        $x = (($lon + 180) * ($width / 360));
        $y = ((($lat * -1) + 90) * ($height / 180));
        */
        
        $this->x = ($long + 180) / 360;
        $this->y = (($lat * -1) + 90) / 180;
    }
    
    public function __destruct()
    {
        // echo('deleting Place!<br />');
    }
}

class Quake extends Place
{
    private $mag;
    
    public function __construct($x,$y,$m)
    {
        parent::__construct($x,$y);
        $this->mag = $m;
    }
    
    public function printMe()
    {
        echo('Quake ' . $this->lat . ' ' . $this->long . ' ' . $this->mag . '<br />');
    }
    
    public function printXML()
    {
        echo('<quake>');
        echo('<long>' . $this->x . '</long>');        
        echo('<lat>' . $this->y . '</lat>');
        echo('<mag>' . $this->mag . '</mag>');
        echo('</quake>');
    }
}

class CSVReader
{
    protected $url = '';
    protected $labels;
    protected $data;
    
    public function __construct($url)
    {
        $this->url      = $url;
        $this->labels   = array();
        $this->data     = array();
        
        $this->loadCSV($url);
        // $this->printData();
    }
    
    public function __destruct()
    {
        unset($this->labels);
        
        $delcount = 0;
        
        for ($i=0;$i<count($this->data);$i++)
        {
            $delcount++;
            unset($this->data[$i]);
        }
        // echo('Deleted ' . $delcount . ' items<br />');
    }
    
    public function loadCSV()
    {
        // open the specified url        
        $handle = fopen($this->url,'r');
        $row = 1;
        
        while (($data = fgetcsv($handle)) !== FALSE)
        {
            if ($row == 1)
            {
                for ($i=0; $i < count($data); $i++)
                {
                    $this->labels[$i] = $data[$i];    
                }                
            }
            else
            {
                array_push($this->data,$data);    
            }
            $row++;
        }
        
        // done reading, close the stream
        fclose($handle);        
        
    }
    
    public function printData()
    {
        echo('Printing ' . count($this->data) . ' rows <br/>');
        for ($i=0; $i<count($this->data); $i++)
        {
            print_r($this->data[$i]);
            print('<hr />');
        }
    }
}

class QuakeCSV extends CSVReader
{
    private $quakes;
    
    public function __construct($url)
    {
        parent::__construct($url);
        $this->quakes = array();
        
        $this->loadQuakes();
    }
    
    public function loadQuakes()
    {
        // determine the index for lat, long, and mag
        $lat_index  = array_search('Lat',$this->labels);
        $lon_index = array_search('Lon',$this->labels);
        $mag_index  = array_search('Magnitude',$this->labels);
        
        $lat    = NULL;
        $lon    = NULL;
        $mag    = NULL;
        $q      = NULL;
                
        // create a quake from each entry
        for ($i=0; $i<count($this->data); $i++)
        {
            $lat = $this->data[$i][$lat_index];
            $lon = $this->data[$i][$lon_index];
            $mag = $this->data[$i][$mag_index];
            
            $q = new Quake($lat,$lon,$mag);
            
            array_push($this->quakes,$q);
        }
    }
    
    public function printXML()
    {
        echo('<xml>');
        
        for ($i=0; $i<count($this->quakes); $i++)
        {
            $this->quakes[$i]->printXML();
            
        }
        
        echo('</xml>');
    }
}

?>
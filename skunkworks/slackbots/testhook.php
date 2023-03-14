<?php

/*
token=lN95VyG0DEQHS8DJeHujQA20
team_id=T0001
channel_id=C2147483705
channel_name=test
timestamp=1355517523.000005
user_id=U2147483697
user_name=Steve
text=googlebot: What is the air-speed velocity of an unladen swallow?
trigger_word=googlebot:


{
	"text": "African or European?"
}
*/

$opinions = array('@@ is the better choice', 'I would go with @@', '$$ is for tea partiers and other idiots- go with @@', '@@ is the way to go', '@@ is what all the cool kids are doing', 'Survey says... @@', 'I hear @@ is trending');

if (!empty($_POST['text']))
{
	$text = $_POST['text'];
	$parts = explode(' ', $text);

	$output = '';

	if (preg_match('/([d][0-9]+)/', $parts[1]) == 1)
	{
		// $output = 'DICE FOUND ';

		$num = str_replace('d', '', $parts[1]);
		// $output .= ' ' . $num . ' ';

		$max = intval($num);
		// $output .= ' ' . $num . ' ';

		$num = rand(1, $max);
		// $output .= ' ' . $num . ' ';

		$output .= 'result: ' . $num;

		if ($num == $max)
		{
			$ouput .= ' CRITICAL SUCCESS!';
		}
	}		
	else
	{
		$option1 = '';
		$option2 = '';

		$addTo = 1;

		$vsFound = 0;

		for ($i=1; $i < count($parts); $i++)
		{
			if (strcmp($parts[$i], 'vs') == 0)
			{
				$addTo = 2;
				$vsFound = 1;
			}
			else
			{
				if ($addTo == 1)
				{
					$option1 .= $parts[$i] . ' ';
				}
				else
				{
					$option2 .= $parts[$i] . ' ';
				}
			}
		}

		if ($vsFound == 1)
		{

			$pattern = array_rand($opinions);
			$pattern = $opinions[$pattern];

			// $output = 'I prefer ' . $option1 . ' in this case'; 
			$output = str_replace('@@', $option1, $pattern);
			$output = str_replace('$$', $option2, $output);

			if (rand(0,10) > 5)
			{
				$output = str_replace('@@', $option2, $pattern);
				$output = str_replace('$$', $option1, $output);
			}
		}

		/*
		$response = array('text' => 'You just said ' . $_POST['text']);	
		echo(json_encode($response));
		*/
	}

	$response = array('text' => $output);	
	echo(json_encode($response));

}
else
{
	$response = array('text' => 'no input found');	
	echo(json_encode($response));

}


?>
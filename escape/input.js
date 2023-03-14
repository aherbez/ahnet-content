var keystates = new Array();

function handleKeyDown(e)
{    
    keystates[e.keyCode] = true;
    /*
    switch (e.keyCode)
    {
        case 38:
            break;
        case 40:
            break;
        case 37:
            break;
        case 39:
            break;
        case 87:
            // W
            break;
        case 83:
            // S
            break;
        case 65:
            // A
            break;
        case 68:
            break;
    }
    */
}

function handleKeyUp(e)
{
    keystates[e.keyCode] = null;
}
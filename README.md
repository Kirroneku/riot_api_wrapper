# riot_api_wrapper

An basic api wrapper to use in GCP function (Potentially AWS Lambda function) - Cheaper to use than a microservice like App Engine (esp since all it does is fetch the data and manipulate it a bit).

You can find this on a live gcp function.

To get ranked info on a summoner:
{Link to api}/summoner-info?summoner={summoner name}

To get information on if a summoner is in game:
{Link to api}/summoner-ingame?summoner={summoner name}

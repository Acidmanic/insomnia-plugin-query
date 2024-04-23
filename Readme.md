Query Plugin
===================


About
----------

This plugin adds __query__ template tag to your Insomnia, which can provide values from requests or responses, using a __LinQ__-like query syntax.



How to install
---------------

__Using Insomnia Hub:__ You can navigate to [Insomnia Plugin Hub Page](https://insomnia.rest/plugins) and search for _Query_ plugin, Open the details page and click __Install Plugin__ button. This throw an installation link which you can open with your insomnia on your desktop.


__Directly installing the zip file:__: You can [download](https://github.com/Acidmanic/insomnia-plugin-query/archive/refs/heads/master.zip) project zip file from github. 
Then extract the content into a directory at your [insomnia's plugin's directory](https://docs.insomnia.rest/insomnia/introduction-to-plugins#plugin-file-location).


__Using Insomnia Application:__ You can Open your insomnia application, go to Preferences menu, open the plugins tab and enter the name _insomnia-plugin-query_ into text box, the click __Install Plugin__ button.


How to use
----------

By clicking the created template tag, you can edit parameters:


 * Target Request: the request which would be searched for values.
 * Json Query: This would be a query you write to find your target field
 * Trigger Behavior: Here you can select whether or not to re send the target request.


 Consider you have the following response for a request to [Json Place Holder](https://jsonplaceholder.typicode.com/todos)


```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  {
    "userId": 1,
    "id": 4,
    "title": "et porro tempora",
    "completed": true
  },
  {
    "userId": 1,
    "id": 5,
    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
    "completed": false
  }
]
```

and now you want to find the id for an item with the title __fugiat veniam minus__.
For that, you can write a query like: ```$.(@title == 'fugiat veniam minus').id```.
This query would be evaluated to __3__.

__$__ means the whole response/request data. you can go one step deeper into the data structure with a dot. Or you can put a query using parentheses.
when writing a query, you would provide an binary condition which might be true for a number of items. in this case, the first matching item would be selected. then you can keep going deeper to select the target field from the item.

In the given example, ```@title == 'fugiat veniam minus'``` selects items with title equal to _'fugiat veniam minus'_,then the ```.id``` part will select it's id property, therefor the __Query__ template tag will be evaluated to __3__.


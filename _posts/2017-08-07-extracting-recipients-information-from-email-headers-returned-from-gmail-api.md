---
title: Extracting recipients information from email headers returned from Gmail API
excerpt: In this post I explain one can properly extract the recipients list from the Gmail API response with some regex.
---

In this post I explain one can properly extract the recipients list from the Gmail API response with some regex.

From the [Gmail API documentation](https://developers.google.com/gmail/api/v1/reference/), when you send a get request to the Gmail API at https://www.googleapis.com/gmail/v1/users/userId/messages/messageId with the appropriate userId and messageId, it returns a [Users.message resource](https://developers.google.com/gmail/api/v1/reference/users/messages#resource) which looks something like this:

```json
{
  "id": string,
  "threadId": string,
  "labelIds": [
    string
  ],
  "snippet": string,
  "historyId": unsigned long,
  "internalDate": long,
  "payload": {
    "partId": string,
    "mimeType": string,
    "filename": string,
    "headers": [
      {
        "name": string,
        "value": string
      }
    ],
    "body": users.messages.attachments Resource,
    "parts": [
      (MessagePart)
    ]
  },
  "sizeEstimate": integer,
  "raw": bytes
}
```

The recipients can be obtained from the `headers field`, by taking the value corresponding to "to" in the name. Usually, with multiple recipients, the value looks something like this:

```
"John Miranda" <john@gmail.com>, "Doe, Emily" <emilydoe@gmail.com>, something@example.com
```

The recipients are comma separated and for each recipient there are 2 main formats it can come in:
- "Name" \<email address\>
- email address

If name is present, it is enclosed in angular brackets. Sometimes the name is not present, and the email address appears alone, without the angular brackets. When there is a comma in the name, it will be enclosed by quotation marks. 

I want to extract the recipients information from this response into an array, preferably with each item of the array being a dictionary containing name and email of the sender, if it exists. However, we cannot simply split the string by commas, since there might be a comma in the name too. 

The following javascript regex takes both cases into account and splits the string properly:

```javascript
function parseEmailRecipients(recipientString) {

  // an example string:
  // const str = `"John Miranda" <john@gmail.com>, "Doe, Emily" <emilydoe@gmail.com>, something@example.com, John Doe <something@gmail.com>, `;
  const regex = /(([\w,\"\s]+)\s)?<?([^@<\s]+@[^@\s>]+)>?,?/g;
  let m;
  let recipientsArray = [];

  while ((m = regex.exec(recipientString)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      let name = null;
      let email = null;

      if (m[2]) {
      	name = m[2].replace(/,$/, '').replace(/"/g, "").trim(); // strip whitespaces and commas, and remove quotation marks
      };

      if (m[3]) {
      	email = m[3].replace(/,$/, '').trim(); // strip whitespaces and commas from end of string
      }

      let item = {
      	name: name,
      	email: email,
      };
      recipientsArray.push(item)
  }
  return recipientsArray;
}
```


The main part of the function is in this regex `(([\w,\"\s]+)\s)?<?([^@<\s]+@[^@\s>]+)>?,?`. (As a side note, [regex101.com](https://regex101.com/) is a useful place to test your regex with an example string.) This regex string can be broken down into two main parts. 

The first part `(([\w,\"\s]+)\s)?` optionally identifies the name. The outermost round brackets denote a group. Inside it, we have a square bracket that tells it to look for any of these characters in the list: `\w` (any word character, that is, any letter, digit, or understore, equivalent to `[a-zA-Z0-9_]`), `,`, `"`, and `\s` (a whitespace character). The `+` tells regex to match as many of these as possible, that is, it can match any character that belongs in the list any number of times. This is followed by a space again. The question mark that follows tells it that this whole group is optional - there may be some items without names appearing in front. 

The second part `<?([^@<\s]+@[^@\s>]+)>?` identifies the email. The opening and closing angle brackets are optional, therefore they are both followed by a question mark. The expression enclosed in round brackets describes the email format, which basically says look for a bunch of adjacent characters that are not `@` or `\s`, followed by a `@` symbol, then followed by another bunch of characters that are not `@` or `\s`. This is then enclosed by optional angle brackets. 

`regex.exec` then returns the groups that were identifies through the round brackets. After that, all that's left to do is to trim some residual spaces and commas from the end of the string and remove the quotation marks that sometimes encloses a name. 

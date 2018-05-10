---
title: Extracting recipients information from email headers returned from Gmail API
tags: [js, gmail, re]
---

In a recent side project I needed to figure out a way to properly extract the recipients list from the Gmail API response. In the end I managed to do it with some regex and this is just a post documenting how I did it. 
<!--more-->

From the [Gmail API documentation](https://developers.google.com/gmail/api/v1/reference/), when you send a get request to the Gmail API for a particular `userId` and `messageId`, it returns a [Users.message resource](https://developers.google.com/gmail/api/v1/reference/users/messages#resource) which looks something like this:

```
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

The recipients can be obtained from the `headers` field, by taking the value corresponding to "to" in the name. Usually, with multiple recipients, the value looks something like this:

```
"John Miranda" <john@gmail.com>, "Doe, Emily" <emilydoe@gmail.com>, something@example.com
```

The recipients are comma separated and for each recipient there are 2 main formats it can come in:

- "Name" \<email address\>
- email address

There are a few things that has to be taken into account that makes the problem not so simple: 

- if name is present, email address is enclosed in angular brackets
- otherwise, email address appears alone, without the angular brackets
- name is enclosed by quotation marks if there is a comma in the name

The end goal is to extract the recipients information from this response into an array with each item of the array being a dictionary containing the name and email of the sender, if they exist. It is obvious that we cannot simply split the string by commas, since there might also be a comma in the name. 

The following javascript regex takes the above considerations into account and, as far as I've tested it, splits the string properly:

```javascript
function parseEmailRecipients(recipientString) {

  // an example string:
  // const str = `"John Miranda" <john@gmail.com>, "Doe, Emily" <emilydoe@gmail.com>, something@example.com, John Doe <something@gmail.com>, `;
  const regex = /(([\w,\"\s]+)\s)?<?([^@<\s]+@[^@\s>]+)>?,/g;
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

The main part of the function is in this regex `(([\w,\"\s]+)\s)?<?([^@<\s]+@[^@\s>]+)>?,`, which can be broken down into three main parts:

1. `(([\w,\"\s]+)\s)?`
2. `<?([^@<\s]+@[^@\s>]+)>?`
3. `,`

The **first part** `(([\w,\"\s]+)\s)?` optionally identifies the name. The outermost round brackets denote a group. Inside it, we have a square bracket that tells it to look for any of these characters in the list: `\w` (any word character, that is, any letter, digit, or understore, equivalent to `[a-zA-Z0-9_]`), `,`, `"`, and `\s` (a whitespace character). The `+` tells regex to match as many of these as possible, that is, it can match any character that belongs in the list any number of times. This is followed by a space again. The question mark that follows tells it that this whole group is optional - there may be some items without names appearing in front. 

The **second part** `<?([^@<\s]+@[^@\s>]+)>?` identifies the email. The opening and closing angle brackets are optional, therefore they are both followed by a question mark. The expression enclosed in round brackets describes the email format, which basically says look for a bunch of adjacent characters that are not `@` or `\s`, followed by a `@` symbol, then followed by another bunch of characters that are not `@` or `\s`. This is then enclosed by optional angle brackets. 

The **last comma** specifies the separator. Note that I don't think the last entry ends with a trailing comma, and this which would cause the regex to skip the last recipient when parsing. However this problem can be easily circumvented by manually adding a comma to the end of the string before using the regex.  

`regex.exec` then returns the groups that were identifies through the round brackets. After that, all that's left to do is to trim some residual spaces and commas from the end of the string and remove the quotation marks that sometimes encloses a name. 

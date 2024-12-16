document.addEventListener('DOMContentLoaded', function () {
  // Inbox
  get_emails_inbox();

  // Sent
  document.querySelector('#sent-tab').addEventListener('click', get_emails_sent);

  // Archived
  document.querySelector('#archived-tab').addEventListener('click', get_emails_archived);

  // Form submission event
  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();
    send_email();
  });
});

function email_display_format(value) {
  var read_state = value.read ? 'Read' : 'Unread';

  return `
  <tr>
      <td class="pl-3">
          <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="cst${value.id}" />
              <label class="custom-control-label" for="cst${value.id}">&nbsp;</label>
          </div>
      </td>
      <td><i class="fa fa-star text-warning"></i></td>
      <td><span class="mb-0 text-muted font-light">${value.sender}</span></td>
      <td>

          <a class="link" href="javascript: void(0)">
              <span class="badge badge-pill text-white font-medium badge-danger mr-2">${read_state}</span>
              <span class="font-light text-dark">${value.subject}</span>
          </a>
      </td>
      <td><i class="fa fa-paperclip text-muted"></i></td>
      <td class="text-muted font-light">${value.timestamp}</td>
  </tr>
  `;
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;

  // Validate if recipients are filled in
  if (!recipients) {
    document.querySelector('#modal-title').innerHTML = `<font color="red">Error</font>`;
    document.querySelector('#announce').innerHTML = `<p>At least one recipient required.</p>`;

    // Show the error modal
    $('#announce-modal').modal('show');

    return;
  }

  // Proceed to send email if validation passes
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      sender: document.querySelector('#compose-sender').value,
      recipients: recipients,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value,
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.error) {
        document.querySelector('#modal-title').innerHTML = `<font color="red">Error</font>`;
        document.querySelector('#announce').innerHTML = `<p>${result.error}</p>`;
        $('#announce-modal').modal('show');
      }
      else {
        document.querySelector('#modal-title').innerHTML = `<font color="green">Successfully</font>`;
        document.querySelector('#announce').innerHTML = `<p>${result.message}</p>`;
        $('#announce-modal').modal('show');

        // Clear out composition fields
        document.querySelector('#compose-recipients').value = '';
        document.querySelector('#compose-subject').value = '';
        document.querySelector('#compose-body').value = '';
      }
    });
}

function archive_emails(event) {
  event.preventDefault();

  var button_clicked = event.srcElement.className;
  button_clicked = button_clicked.split(' ');
  button_clicked = button_clicked[button_clicked.length - 1];
  console.log(button_clicked);

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  let email_ids = [];
  checkboxes.forEach(checkbox => {
    const email_id = checkbox.id.replace('cst', '');
    email_ids.push(email_id);
  });

  if (email_ids.length === 0) {
    alert('Please select at least one email to archive.');
    return;
  }
  else {
    const API_URLS = [];
    email_ids.forEach(email_id => {
      API_URLS.push(`emails/${email_id}`);
    })

    // , {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     archived: true
    //   })
    // }

    Promise.all(API_URLS.map((url) => fetch(url)
      .then((response) => response.json())))
      .then((jsons) => {
        jsons.forEach((json) => console.log(json));
      })
  }
}

function get_emails_inbox() {
  let emails_inbox = "";
  let unread_emails = 0;

  fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {

      emails.forEach(email => {
        if (!email.read) {
          unread_emails++;
        }

        emails_inbox += email_display_format(email);
      });

      document.querySelector('#email_inbox_table').innerHTML = emails_inbox;
      document.querySelector('#unread_emails').innerHTML = `${unread_emails} Unread Emails`;
    });
}

function get_emails_sent() {
  let emails_sent = "";
  let sent_emails = 0;

  fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        sent_emails = emails.length;

        emails_sent += email_display_format(email);
      });

      document.querySelector('#email_sent_table').innerHTML = emails_sent;
      document.querySelector('#sent_emails').innerHTML = `You Sent ${sent_emails} Emails`;
    });
}

function get_emails_archived() {
  let emails_archived = "";
  let archived_emails = 0;

  fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        archived_emails = emails.length;

        emails_archived += email_display_format(email);
      });

      document.querySelector('#email_archived_table').innerHTML = emails_archived;
      document.querySelector('#archived_emails').innerHTML = `You Archived ${archived_emails} Emails`;
    });
}
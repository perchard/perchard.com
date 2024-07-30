import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/+esm'
const supabase = createClient('https://szzqrrbnlhftncimdjdu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6enFycmJubGhmdG5jaW1kamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMzMwOTMsImV4cCI6MjAzNzcwOTA5M30.0Ej4JGFZwFR4BXevkeknU4M9QAnloP7rj9LbdIf-r2Y')

async function fetchData() {
    const { data, error } = await supabase
        .from('guestbook')
        .select('message, name, location, created_at')
        .order('created_at', { ascending: false });
    if (error) {
        console.error(error);
    } else {
        updateDOM(data);
    }
}

function updateDOM(data) {
    const div = document.getElementById('guestbook');
    div.innerHTML = '';
    data.forEach(item => {
        const itemElement = document.createElement('div');
        const message = DOMPurify.sanitize(item.message, {ALLOWED_TAGS: []});
        const name = DOMPurify.sanitize(item.name, {ALLOWED_TAGS: []});;
        const location = DOMPurify.sanitize(item.location, {ALLOWED_TAGS: []});
        itemElement.innerHTML = `${message}<br>– ${name} (${location})<br><br>`;
        div.appendChild(itemElement);
    });
}

async function handleSubmit(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;

    const { data, error } = await supabase.from('guestbook').insert([
        { message, name, location }
    ]);

    if (error) {
        console.error(error);
    } else {
        console.log('Data inserted:', data);
        fetchData();
    }

    document.getElementById('message').value = '';
    document.getElementById('name').value = '';
    document.getElementById('location').value = '';
}

document.getElementById('data-form').addEventListener('submit', handleSubmit);
fetchData();

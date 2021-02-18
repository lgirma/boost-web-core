<script>
    let subject = '';
</script>

<div>
    <label for="subject">Subject</label>
    <input bind:value={subject} id="subject" />
</div>
<div>
    Hello, {subject} World!
</div>
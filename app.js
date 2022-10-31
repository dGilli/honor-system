const recipient ='test@example.com'
const subject = 'Kaffee mitgenommen'
const body = `
Anzahl an Kaffee?

X

Danke!
`.trim()

window.location.href = `mailto:${recipient}?subject=${subject}&body=${body.replace(/\n/g, '%0A')}`;
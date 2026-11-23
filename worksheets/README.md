# Practice and challenge sheets

One template for the Academy's practice sheets (KS3) and the Lab's challenge sheets (GCSE), each with
Securing, Extending and Mastery sections and an answers page.

    python3 make_sheet.py samples/lab-simultaneous.json      # writes samples/lab-simultaneous.html
    NODE_PATH=$(npm root -g) node topdf.js $PWD/samples/lab-simultaneous.html   # A4 PDF with page numbers

A sheet is described once in JSON: product (academy | lab), code, title, level line, time, case notes,
what each level means, and the questions per level (text, equations, marks, working lines, answer, key
step, optional Forensic tip or Tampered Evidence working). Lab sheets add marked_url / marked_topic for the
Forensic Marking QR code on Mastery. Every answer in the samples was checked by calculation.

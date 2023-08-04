import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from 'redux/operations';
import { selectContacts } from 'redux/selectors';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import { Form, Input, Label, SubmitButton } from './ContactForm.styled';

export const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const nameRef = useRef(null);
  const numberRef = useRef(null);

  const handleSubmit = event => {
    event.preventDefault();

    const name = nameRef.current.value;
    const number = numberRef.current.value;

    const contact = {
      id: nanoid(),
      name,
      number,
    };

    const isExist = contacts.find(
      ({ name: existingName }) =>
        existingName.toLowerCase() === name.toLowerCase()
    );

    if (isExist) {
      return toast.warn(`${name} is already in contacts.`);
    }

    dispatch(addContact(contact));
    event.currentTarget.reset();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor={nanoid()}>
        Name
        <Input
          ref={nameRef}
          type="text"
          name="name"
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          id={nanoid()}
          required
        />
      </Label>
      <Label htmlFor={nanoid()}>
        Number
        <Input
          ref={numberRef}
          type="tel"
          name="number"
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          id={nanoid()}
          required
        />
      </Label>

      <SubmitButton type="submit">Add contact</SubmitButton>
    </Form>
  );
};

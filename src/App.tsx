import React, {ChangeEvent, useState} from 'react';
import crypto from 'crypto';
import classes from './App.module.css';
import TextField from '@material-ui/core/TextField';

interface FormState { password: string, realm: string, login: string, uri: string, nonce: string }

const DEFAULT_URI = "sip:sipgate.de";
const DEFAULT_REALM = "sipgate.de";
const DEFAULT_FORM_STATE: FormState = {
  uri: DEFAULT_URI,
  realm: DEFAULT_REALM,
  login: "",
  password: "",
  nonce: ""
};

function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

function calculateResponse({ uri, realm, login, password, nonce }: FormState): string | null {
  if (!(uri && realm && login && password && nonce)) {
    return null;
  }

  const ha1 = md5(`${login}:${realm}:${password}`);
  const ha2 = md5(`REGISTER:${uri}`);
  return md5(`${ha1}:${nonce}:${ha2}`);
}

const App: React.FC = () => {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);

  const updateField = (fieldName: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [fieldName]: event.target.value
    })
  };

  const response = calculateResponse(formState);

  return (
    <div className={classes.container}>
      <h1>SIP Auth Check</h1>
      <form autoComplete="off">
        <TextField label="URI" value={formState.uri} fullWidth onChange={updateField("uri")} />
        <TextField label="Realm" value={formState.realm} onChange={updateField("realm")} fullWidth />
        <TextField label="Login" placeholder="1234567e0" value={formState.login} onChange={updateField("login")} fullWidth />
        <TextField label="Password" placeholder="secret" value={formState.password} onChange={updateField("password")} fullWidth />
        <TextField label="Nonce" placeholder="secret" value={formState.nonce} onChange={updateField("nonce")} fullWidth />
      </form>
      {response &&
        <div className={classes.responseContainer}>
          Valid auth response: <pre>{response}</pre>
        </div>
      }
      <footer className={classes.footer}>
        <a href="https://github.com/bfncs/sip-auth-check" target="_blank" rel="noopener noreferrer">Source</a>
      </footer>
    </div>
  );
};

export default App;

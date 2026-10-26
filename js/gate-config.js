/* 18+ gate config. SHA-256 (hex) of the passcode ONLY; the passcode itself is never stored in this repo.
   Changing this hash re-locks every device (the remembered unlock is tied to the hash). */
window.GATE_CONFIG = {
  hash: "edeff70ec4a81573cf2187e4363061af533ce27da6bf48807ade32db0830c453",
  key: "dadR.gate.v1"
};

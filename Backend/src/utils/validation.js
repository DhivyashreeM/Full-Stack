export const validateFileId = (fileId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(fileId);
};

export const validateFastaHeader = (header) => {
  if (!header || header.length === 0) return false;
  if (header.length > 1000) return false; // Reasonable header length limit
  return true;
};

export const validateSequence = (sequence) => {
  if (!sequence || sequence.length === 0) return false;
  
  // Check for valid nucleotide characters (including ambiguous bases)
  const validChars = /^[ACGTURYKMSWBDHVNacgturykmswbdhvn\-*]+$/;
  return validChars.test(sequence);
};

export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};

declare namespace Bun {
  function randomUUIDv7(): string;
  const password: {
    verify: (password: string, hash: string, algorithm?: "argon2id" | "bcrypt") => Promise<boolean>;
    hash: (password: string, options?: { algorithm?: "argon2id" | "bcrypt"; cost?: number }) => Promise<string>;
  };
}

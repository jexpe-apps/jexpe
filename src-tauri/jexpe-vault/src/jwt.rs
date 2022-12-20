use std::error::Error;
use jsonwebtoken::{decode, DecodingKey, encode, EncodingKey, Header, Validation};
use crate::{Claims, JWT_SECRET};

pub(crate) fn sign_token(master_password: String) -> Result<String, Box<dyn Error>> {
    encode(
        &Header::default(),
        &Claims::new(master_password),
        &EncodingKey::from_secret(JWT_SECRET.as_bytes()),
    ).map_err(|e| "Error signing token".into())
}

pub(crate) fn verify_token(token: &str) -> Result<String, Box<dyn Error>> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_bytes()),
        &Validation::default(),
    )?;
    Ok(token_data.claims.master_password)
}

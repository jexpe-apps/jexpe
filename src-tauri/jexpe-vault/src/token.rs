use chrono::Utc;
use std::error::Error;
use serde::{Deserialize, Serialize};
use jsonwebtoken::{DecodingKey, encode, EncodingKey, Header, Validation};
use rand::{distributions, Rng};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    exp: usize,
    iat: usize,
    master_password: String,
}

pub fn generate_token_secret() -> String {
    rand::thread_rng()
        .sample_iter(&distributions::Alphanumeric)
        .take(32)
        .map(char::from)
        .collect()
}

pub fn sign_token(secret: &[u8], master_password: String) -> Result<String, Box<dyn Error>> {
    let now = Utc::now().timestamp() as usize;
    let claims = Claims {
        exp: now + 900000,
        iat: now,
        master_password,
    };
    return match encode(&Header::default(), &claims, &EncodingKey::from_secret(secret)) {
        Ok(token) => Ok(token),
        Err(_) => Err("Failed to sign token".into()),
    };
}

pub fn verify_token(secret: &[u8], token: &str) -> Result<String, Box<dyn Error>> {
    let token_data = jsonwebtoken::decode::<Claims>(token, &DecodingKey::from_secret(secret), &Validation::default())?;
    Ok(token_data.claims.master_password)
}

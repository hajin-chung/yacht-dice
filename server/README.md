# Yacht-dice api

## socket message format

```json
// game move(dice reroll): client -> server
{
    "game-id": string,
    "user-id": string,
}
```
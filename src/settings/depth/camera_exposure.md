---
spec: 10bc6bbf936d
---

The value runs from `-2` to `+2` stops in half-stop steps, with `0` as the default. It works on top of the camera's automatic exposure, which keeps working either way.

| Value          | Effect                              | When to use it                                 |
| -------------- | ----------------------------------- | ---------------------------------------------- |
| `-2` to `-0.5` | Darker picture                      | A bright window or lamp washes the picture out |
| `0` (default)  | The camera's own automatic exposure | Most rooms                                     |
| `+0.5` to `+2` | Brighter picture                    | A room looks murky on camera                   |

Camera sensors adjust exposure in their own step sizes and ranges, so the panel rounds your value to the nearest step the sensor offers and limits it to the sensor's range. A camera that reports no exposure control ignores the setting. The change applies from the next time the camera opens, to both the stream and snapshots.

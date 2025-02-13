## Documentation

You can see below the API reference of this module.

### `round(num, decimals)`
Rounds a number.

#### Params

- **Number** `num`: The input number.
- **Number** `decimals`: How many decimals.

#### Return
- **Number** The rounded number.

### `setVariableInterval(callbackFunc, timing)`
Sets a variable interval.

#### Params

- **Function** `callbackFunc`: The callback function.
- **Number** `timing`: The interval value.

#### Return
- **Object** The object containing the variable interval methods.

### `circle(x, y, r, w, color)`
Draws a circle on the canvas.

#### Params

- **Number** `x`: The x value.
- **Number** `y`: The y value.
- **Number** `r`: The radius value.
- **Number** `w`: The line width.
- **String** `color`: The color.

### `line(x1, y1, x2, y2, w, color)`
Draws a line on the canvas.

#### Params

- **Number** `x1`: The source `x` value.
- **Number** `y1`: The source `y` value.
- **Number** `x2`: The target `x` value.
- **Number** `y2`: The target `y` value.
- **Number** `w`: The line width.
- **String** `color`: The color.

### `canvasArrow(context, fromx, fromy, tox, toy)`
Draws an arrow on the canvas.

#### Params

- **Object** `context`: The canvas context.
- **Number** `fromx`: The source `x` value.
- **Number** `fromy`: The source `y` value.
- **Number** `tox`: The target `x` value.
- **Number** `toy`: The target `y` value.

### `init()`
This function is called to reinit the canvas.

### `draw()`
Starts drawing the things.

### `handlers()`
This function appends the DOM handlers.

### `getLimit(angle)`
This is a **hack**. This roundes the angle in a format that is supported by the application.

#### Params

- **Number** `angle`: The angle that should be rounded.

#### Return
- **Number** A rounded angle that is supported by the application.

### `badAngle(angle)`
Checks if the angle is supported.

#### Params

- **Number** `angle`: The angle that should be checked.

#### Return
- **null|String** An error (string) or `null`.

### `showError(message)`
Shows an error message.

#### Params

- **String** `message`: The error message.

### `start(point, callback)`
Draws the lines on the canvas.

#### Params

- **Point** `point`: The current point.
- **Function** `callback`: The callback function.

### `M(A:, B:, R:, L:)`
THE MOST IMPORTANT FUNCTION.
It always returns the next point.
                            ------------
(xM(n - 1), yM(n - 1)) ---> |?    ?   ?|
(xM(n), yM(n))         ---> |     M    | ---> (xM(n + 1), yM(n + 1))
Radius                 ---> |?    ?   ?|
Length of segments     ---> ------------

#### Params

- **Object** `A:`: first point
- **Object** `B:`: second point
- **Object** `R:`: radius of big circle
- **Object** `L:`: length of segments

### `firstPoint(m, x1, y1)`
The function that returns ONLY the first point.

#### Params

- **Object** `m`:
- **Object** `x1`:
- **Object** `y1`:

### `getA()`
Function that returns a point giving the angle
                            |------|
        xA          ---->   |      |===> (xA, yA)
        angle (deg) ---->   |      |
                            |------|

### `check()`
Verify if the numbers are correct.
        If not, return an false value.


export const transparentProcessorHTML = `
<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    canvas {
      display: none;
    }
  </style>
</head>

<body>
  <canvas id="canvas"></canvas>
  <script>
    window.addEventListener('message', function (event) {
      try {
        processImage(event.data);
      } catch (error) {
        console.error('Error processing image:', error);
        window.ReactNativeWebView.postMessage('ERROR: ' + error.message);
      }
    });

    function processImage(base64) {
      const img = new Image();

      img.onerror = function (e) {
        window.ReactNativeWebView.postMessage('ERROR: Image load failed');
      };

      img.onload = function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let transparentCount = 0;
        let opaqueCount = 0;

        // 첫 번째 패스: 원본 처리
        for (let i = 0; i < data.length; i += 4) {
          const brightness = data[i];

          if (brightness < 50) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 0; // 완전 투명
            transparentCount++;
          } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
            opaqueCount++;
          }
        }

        const tempData = new Uint8ClampedArray(data);
        const width = canvas.width;
        const height = canvas.height;
        const thickness = 3; // 굵기 조절

        console.log('Edge thickening with thickness:', thickness);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // 현재 픽셀이 투명이면
            if (tempData[idx + 3] === 0) {
              // 주변 픽셀 확인
              let hasEdgeNearby = false;

              for (let dy = -thickness; dy <= thickness; dy++) {
                for (let dx = -thickness; dx <= thickness; dx++) {
                  const ny = y + dy;
                  const nx = x + dx;

                  if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                    const nIdx = (ny * width + nx) * 4;
                    if (tempData[nIdx + 3] === 255) {
                      hasEdgeNearby = true;
                      break;
                    }
                  }
                }
                if (hasEdgeNearby) break;
              }

              // 주변에 엣지가 있으면 현재 픽셀도 엣지로
              if (hasEdgeNearby) {
                data[idx] = 255;
                data[idx + 1] = 255;
                data[idx + 2] = 255;
                data[idx + 3] = 255;
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const resultBase64 = canvas.toDataURL('image/png', 0.5);
        window.ReactNativeWebView.postMessage(resultBase64);
      };

      img.src = 'data:image/png;base64,' + base64;
    }
  </script>
</body>

</html>`;

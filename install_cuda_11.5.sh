#!/bin/bash

set -e

# 1. CUDA 11.8 Installation (runfile local, nicht systemweit)
CUDA_VERSION="11.8.0"
CUDA_RUNFILE="cuda_${CUDA_VERSION}_520.61.05_linux.run"
CUDA_URL="https://developer.download.nvidia.com/compute/cuda/${CUDA_VERSION}/local_installers/${CUDA_RUNFILE}"
CUDA_INSTALL_DIR="/usr/local/cuda-11.8"

echo "=== CUDA 11.8: Download ==="
wget -c $CUDA_URL -O /tmp/$CUDA_RUNFILE

echo "=== CUDA 11.8: Installation (lokal) ==="
sudo sh /tmp/$CUDA_RUNFILE --silent --toolkit --override --installpath=$CUDA_INSTALL_DIR

# 2. cuDNN 8.6 Installation
# Du musst dich hier manuell registrieren und cuDNN 8.6 für CUDA 11.x herunterladen
# Link: https://developer.nvidia.com/rdp/cudnn-archive#a-collapse811-8

CUDNN_TGZ_PATH="/tmp/cudnn-linux-x86_64-8.6.0.163_cuda11-archive.tar.xz"  # Passe ggf. an

if [ ! -f "$CUDNN_TGZ_PATH" ]; then
  echo "Bitte lade cuDNN 8.6 für CUDA 11.x manuell herunter und speichere es als $CUDNN_TGZ_PATH"
  exit 1
fi

echo "=== cuDNN 8.6: Entpacken und Installieren ==="
tar -xf $CUDNN_TGZ_PATH -C /tmp/
CUDNN_DIR=$(tar -tf $CUDNN_TGZ_PATH | head -1 | cut -f1 -d"/")

sudo cp -P /tmp/$CUDNN_DIR/include/cudnn*.h $CUDA_INSTALL_DIR/include/
sudo cp -P /tmp/$CUDNN_DIR/lib/libcudnn* $CUDA_INSTALL_DIR/lib64/
sudo chmod a+r $CUDA_INSTALL_DIR/include/cudnn*.h $CUDA_INSTALL_DIR/lib64/libcudnn*

echo "=== CUDA 11.8 und cuDNN 8.6 Installation fertig ==="
echo "Du kannst CUDA 11.8 jetzt nutzen, indem du z.B. folgende Umgebungsvariablen setzt:"
echo "export CUDA_HOME=$CUDA_INSTALL_DIR"
echo "export LD_LIBRARY_PATH=\$CUDA_HOME/lib64:\$LD_LIBRARY_PATH"
echo "export PATH=\$CUDA_HOME/bin:\$PATH"

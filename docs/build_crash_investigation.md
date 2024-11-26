## Build Crash investigation

### Lack of swap space
First, it seems like the ec2 instance doesn't have any swap space allocated, so I will do that.

```
sudo fallocate -l 1G /swapfile  # Create a 1GB swap file
sudo chmod 600 /swapfile       # Secure the file
sudo mkswap /swapfile          # Set up the swap area
sudo swapon /swapfile          # Enable swap
```

FROM gcc:latest

# Install Python and Java for multi-language support
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (CRITICAL for security)
RUN useradd -m -u 1001 runner

# Create the working directory
RUN mkdir -p /sandbox && chown runner:runner /sandbox

# Switch to non-root runner (no root access!)
USER runner
WORKDIR /sandbox

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
  ];

  shellHook = ''
    echo "Scrob UI development environment loaded"
    echo ""
    echo "Available commands:"
    echo "  npm install      - Install dependencies"
    echo "  npm run dev      - Start dev server"
    echo "  npm run build    - Build for production"
    echo ""
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo ""
  '';
}

{
  description = "MVP logger for web pages";

  outputs = { self, nixpkgs }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = [
          pkgs.nixpkgs-fmt
          pkgs.nil

          pkgs.nodejs
          pkgs.postgresql
        ];
      };
    };
}
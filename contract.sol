// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertiChain {
    address public owner;

    struct Certificate {
        string certHash;
        address issuer;
        uint256 issuedAt;
    }

    mapping(string => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateAdded(
        string certHash,
        address indexed issuer,
        uint256 issuedAt
    );
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender],
            "Only authorized issuer can add certificates"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    function authorizeIssuer(address _issuer) public onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    function revokeIssuer(address _issuer) public onlyOwner {
        require(_issuer != owner, "Owner cannot be revoked");
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }

    function addCertificate(string memory _certHash) public onlyAuthorizedIssuer {
        require(bytes(_certHash).length > 0, "Hash cannot be empty");
        require(
            certificates[_certHash].issuer == address(0),
            "Certificate already exists"
        );

        certificates[_certHash] = Certificate({
            certHash: _certHash,
            issuer: msg.sender,
            issuedAt: block.timestamp
        });

        emit CertificateAdded(_certHash, msg.sender, block.timestamp);
    }

    function getCertificateDetails(
        string memory _certHash
    )
        public
        view
        returns (string memory certHash, address issuer, uint256 issuedAt)
    {
        Certificate memory cert = certificates[_certHash];
        require(cert.issuer != address(0), "Certificate not found");

        return (cert.certHash, cert.issuer, cert.issuedAt);
    }

    function verifyCertificate(
        string memory _certHash
    ) public view returns (bool isValid, address issuer, uint256 issuedAt) {
        Certificate memory cert = certificates[_certHash];

        if (cert.issuer != address(0)) {
            return (true, cert.issuer, cert.issuedAt);
        }

        return (false, address(0), 0);
    }
}
